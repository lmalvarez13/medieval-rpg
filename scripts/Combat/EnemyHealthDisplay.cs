using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RPG.Combat;

namespace RPG.Attributes
{
    public class EnemyHealthDisplay : MonoBehaviour
    {
        Health health;
        Fighter fighter;

        private void Awake()
        {
            fighter = GameObject.FindWithTag("Player").GetComponent<Fighter>();
        }

        private void Update()
        {
            health = fighter.GetTarget();

            if (health == null)
            {
                GetComponent<Text>().text = "N/A";
                return;
            }
            else
            {
                GetComponent<Text>().text = String.Format("{0:0}/{1:0}", health.GetCurrentHealthPoints(), health.GetMaxHealthPoints());
            }

        }
    }

}